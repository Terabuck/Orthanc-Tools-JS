import React, {Component} from 'react'
import { makeStyles } from '@material-ui/core/styles';
import {TreeView, TreeItem} from '@material-ui/lab';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import NumericInput from 'react-numeric-input';

import apis from '../../services/apis'



class Metadata extends Component {

    useStyles = makeStyles({
        root: {
          height: 110,
          flexGrow: 1,
          maxWidth: 400,
        },
    });


    state = {
        data: [], 
        InstancesArray: [],
        currentKey: 0, 
        InstancesTags: true, 
        text: 'disabled'
    }

    async componentDidMount() {
        let array = await apis.content.getSeriesInstances(this.props.serieID) 
        let id = []
        array.forEach(element => id.push(element.ID))
        this.setState({
            InstancesArray: id 
        })
        this.data()
    }

    async getInstancesArray(serieID){
        let array = await apis.content.getSeriesInstances(serieID)
        let id = []
        array.forEach(element => id.push(element.ID))
        this.setState({
            InstancesArray: id 
        })
    }
    

    async data(){
        let data = await apis.content.getInstances(this.state.InstancesArray[this.state.currentKey])
        let header = await apis.content.getHeader(this.state.InstancesArray[this.state.currentKey])
        data = {...data, ...header}
        let prepare = this.prepareData(data)
        this.setState({data: prepare, InstancesTags: true})
        return prepare
    }
 
    prepareData(data){
        let answer = []
        for (let id in data){
            answer.push(Array.isArray(data[id]) ? {name: id, value: data[id].map(node => this.prepareData(node))} : {name: id, value: data[id]})
        }
        return answer
    }

    renderTree(array){
        let rows = []
            if (Array.isArray(array)){
                array.forEach(nodes => {rows.push(
                        <TreeItem key={nodes.name} nodeId={nodes.name} label={nodes.name}>
                            {Array.isArray(nodes.value) ? nodes.value.map((node) => this.renderTree(node)) : nodes.value}
                        </TreeItem>
                    )
                })
                    
            }
        return rows
    }

    async setSharedTags(){
        if (this.state.text === 'disabled'){
            let data = await apis.content.getSharedTags(this.props.serieID)
            this.setState({data: this.prepareData(data), text: 'enabled'})
        } else {
            this.data()
            this.setState({text: 'disabled'})
        }
    }

    async handleChange(num){
        await this.setState(prevState => ({
            currentKey: num >= prevState.InstancesArray.length ? prevState.InstancesArray.length - 1 : num < 0 ? 0 : num
        }))
        this.data()
    }


    render() {
        return (
            <div className='jumbotron'>
                <div className='row mb-4'>
                    <div className='col-auto'>
                        <button type='button' className='btn btn-primary' onClick={()=>this.setSharedTags()} disabled={!this.state.InstancesTags}>Shared Tags: {this.state.text}</button>
                    </div>
                    <div className='col-auto ml-3'>
                        <div className='row'>
                            <label htmlFor='numberInstances' className='text-center'>Number of instances : {this.state.InstancesArray.length}</label>
                        </div>
                        <div className='row' hidden={this.state.text === 'enabled' || this.state.InstancesArray.length === 1}>
                            <NumericInput min={1} max={this.state.InstancesArray.length} value={this.state.currentKey + 1} onChange={(num => this.handleChange(num - 1))} />
                        </div>
                    </div>
                </div>
                <TreeView 
                    className={this.useStyles.root}
                    defaultExpanded={['root']}
                    defaultCollapseIcon={<ExpandMoreIcon />}
                    defaultExpandIcon={<ChevronRightIcon />}>
                        {this.renderTree(this.state.data)}
                </TreeView>
            </div>
        );
    }
}

export default Metadata;