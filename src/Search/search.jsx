import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { history } from '../_helpers';

import { userActions } from '../_actions';
var that;
class Search extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            searchValue:'',
            pageNo:1,
            planetList:[],
            totalPage:[]
        };
        that=this;
        this.handleChange = this.handleChange.bind(this);
        this.fetchPlanets = this.fetchPlanets.bind(this);
        this.logOut = this.logOut.bind(this);
    }

    componentWillMount(){
        this.fetchPlanets(this.state.pageNo,'');
    }

    handleChange(event) {
        event.preventDefault();
        const { name, value } = event.target;
        this.setState({
            searchValue:value
        });
        this.fetchPlanets(this.state.pageNo,value);
      
    }

    logOut(){
        localStorage.removeItem('user');
        history.push('/login');
    }

    fetchPlanets(pageNo,value){
        const { dispatch } = this.props;
        dispatch(userActions.search(pageNo,value)).then(resp=>{

            var pageArray=[];
            for(var i=1;i<=parseInt(resp.data.count/10)+1;i++){
                pageArray.push({pageNo:i}); 
            }
            this.setState({planetList:resp.data.results,totalPage:pageArray});
       })
    }

   
    

    render() {
        const { registering  } = this.props;
        const { user, submitted } = this.state;
        return (
            <div className="col-md-6 col-md-offset-3">
            <a href="javascript:void(0)" onClick={this.logOut}>Log out</a>
                <h2>Search</h2>
                <input type="text" className="form-control" name="firstName" value={this.state.searchValue} onChange={this.handleChange} />
                <form name="form" >
                 
                    <table className="table">
                        <thead>
                        <tr>
                            <th>Planet Name</th>
                            <th>Population</th>
                            <th>Climate</th>
                            <th>Url</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.state.planetList.map(function(object, i){
                            return  <tr key={i}>
                            <td>{object.name}</td>
                            <td>{object.population}</td>
                            <td>{object.climate}</td>
                            <td> <a href={object.url} target='_blank' >{object.url}</a></td>
                        </tr>
                          })}
                       
                        </tbody>
  </table>
                    <ul className="pagination">
                    {this.state.totalPage.map(function(object, i){
                            return   <li  key={i}><a href="javascript:void(0)" onClick={that.fetchPlanets.bind(that,object.pageNo,that.state.searchValue)}>{object.pageNo}</a></li>
                          })}
                  </ul>
                </form>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { registering } = state.registration;
    return {
        registering
    };
}

const connectedRegisterPage = connect(mapStateToProps)(Search);
export { connectedRegisterPage as Search };