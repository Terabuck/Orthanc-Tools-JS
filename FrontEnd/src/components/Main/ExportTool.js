import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import Overlay from 'react-bootstrap/Overlay'
import Popover from 'react-bootstrap/Popover'

import TableStudiesWithNestedSeries from '../CommonComponents/RessourcesDisplay/TableStudiesWithNestedSeries'
import apis from '../../services/apis'
import SendAetDropdown from "../Export/SendAetDropdown"
import DownloadDropdown from "../Export/DownloadDropdown"

import { seriesArrayToStudyArray } from '../../tools/processResponse'
import { emptyExportList, removeSeriesFromExportList, removeStudyFromExportList } from '../../actions/ExportList'

class ExportTool extends Component {

    state = {
        aet: []
    }

    constructor(props){
        super(props)
        this.handleClickEmpty = this.handleClickEmpty.bind(this)
        this.onDeleteSeries = this.onDeleteSeries.bind(this)
        this.onDeleteStudy = this.onDeleteStudy.bind(this)
    }

    async componentDidMount() {
        let aets = await apis.aets.getAets()
        this.setState({
            aets: aets
        })
    }
    
    

    handleClickEmpty(){
        this.props.emptyExportList()
    }

    onDeleteSeries(serieID){
        this.props.removeSeriesFromExportList(serieID)
    }

    onDeleteStudy(studyID){
        this.props.removeStudyFromExportList(studyID)
    }

    getExportIDArray(){
        let ids = []
        this.props.seriesArray.forEach(serie => {
            ids.push(serie.ID)
        })
        return ids
    }

    render(){
        let idArray = this.getExportIDArray()
        return (
            <Overlay target={this.props.target} show={this.props.show} placement='left' onHide={this.props.onHide} rootClose >
                <Popover id='popover-export' style={ { maxWidth: '100%' } } >
                    <Popover.Title as='h3'>Export List</Popover.Title>
                    <Popover.Content>
                        <div className="float-left mb-3">
                            <Link className='btn btn-primary' to='/export' onClick={this.props.onHide}>Open Export Tools</Link>
                        </div>
                        <div className="float-right mb-3">
                            <button type="button" className="btn btn-warning" onClick={this.handleClickEmpty} >Empty List</button>
                        </div>
                        <TableStudiesWithNestedSeries 
                            data={seriesArrayToStudyArray(this.props.seriesArray, this.props.studyArray)} 
                            hiddenRemoveRow={false} 
                            hiddenAccessionNumber={true}
                            hiddenActionBouton={true}
                            hiddenName={false}
                            hiddenID={false}
                            onDeleteStudy={this.onDeleteStudy} 
                            onDeleteSeries={this.onDeleteSeries} 
                            pagination={true}
                            wrapperClasses="table-responsive" />
                        <div className="row text-center mt-5">
                            <div className='col-sm'>
                                <DownloadDropdown exportIds={idArray} />
                            </div>
                            <div className='col-sm'>
                                <SendAetDropdown aets={this.state.aets} exportIds={idArray} />
                            </div>
                        </div>
                    </Popover.Content>
                </Popover>
            </Overlay>
        )
    }
}

const mapStateToProps = state => {
    return {
        seriesArray: state.ExportList.seriesArray,
        studyArray: state.ExportList.studyArray
    }
}

const mapDispatchToProps = {
    emptyExportList, 
    removeStudyFromExportList, 
    removeSeriesFromExportList
}

export default connect(mapStateToProps, mapDispatchToProps)(ExportTool)
