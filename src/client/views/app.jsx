var React = require('react');
var DataList=require('./datalist.jsx');

module.exports = React.createClass({
    getInitialState: function() {
        return {infos: 'no selection', items: [],selected:null,userName:''};
    },
    setUserName: function(t) {
        this.setState({userName: t});
    },
    setDatas: function(datas) {
        this.setState({items: datas});
    },
    select: function(name) {
      if(name!=null){
        this.setState({selected: name,infos:'selected :'+name});
      }else{this.setState({selected: name,infos:'no selection'});}
    },

    render: function() {

        return (
            <div>
              <div>ID : {this.state.userName}</div>

                <div>{this.state.infos}</div>
                <DataList items={this.state.items} selected={this.state.selected} user={this.state.userName}/>
            </div>
        )
    }
});
