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
    select: function(i) {
      if(i!=null){
        this.setState({selected: i,infos:'selected :'+i.toString()});
      }else{this.setState({selected: i,infos:'no selection'});}
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
