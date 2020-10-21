import React, { Component } from 'react';
import axios from 'axios';
import './App.css';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      dataApi: [],
      edit: false,
      dataPost: {
        id: 0,
        nama_karyawan: "",
        jabatan: "",
        jenis_kelamin: "",
        tanggal_lahir: ""
      }
    }
    this.handleRemove = this.handleRemove.bind(this);
    this.inputChange = this.inputChange.bind(this);
  }

  inputChange(e){
    let newdataPost = {...this.state.dataPost};
    if (this.state.edit === false) {
      newdataPost["id"] = new Date().getTime();
    }
    newdataPost[e.target.name] = e.target.value;

    this.setState(
      {
      dataPost: newdataPost
    });
  }

  handleSubmit = (e) => {
    if (this.state.edit === false) {
      axios.post('http://localhost:3004/data-karyawan',this.state.dataPost).then(() => {
        this.reloadData();
        this.clearData();
      });
    } else {
      axios.put(`http://localhost:3004/data-karyawan/${this.state.dataPost.id}`,this.state.dataPost).then(() => {
        this.reloadData();
        this.clearData();
      });
    }
  }

  handleRemove(e){
    console.log(e.target.value);
    fetch(`http://localhost:3004/data-karyawan/${e.target.value}`,{
      method: "DELETE"
    }).then(res => this.reloadData());
  }

  reloadData(){
    axios.get('http://localhost:3004/data-karyawan').then(res => {
      this.setState({
        dataApi: res.data,
        edit: false
      });
    });
  }

  getDataId = (e) => {
    axios.get(`http://localhost:3004/data-karyawan/${e.target.value}`).then(res => {
      this.setState({
        dataPost: res.data,
        edit: true
      });
    });
  }

  clearData = () => {
    let newdataPost = {...this.state.dataPost};

    newdataPost['id'] = 0;
    newdataPost['nama_karyawan'] = "";
    newdataPost['jabatan'] = "";
    newdataPost['jenis_kelamin'] = ""
    newdataPost['tanggal_lahir'] = ""

    this.setState({
      dataPost: newdataPost,
      edit: false
    });
  }

  componentDidMount(){
    // fetch('https://jsonplaceholder.typicode.com/posts')
    //   .then(response => response.json())
    //   .then(res => {
    //     this.setState({
    //       dataApi: res
    //     });
    //   });
    this.reloadData();
  }

  render(){
    return(
      <>
        <h1>Data Karyawan</h1>
        <input
          type="text"
          name="nama_karyawan"
          placeholder="Masukan Nama Karyawan"
          value={this.state.dataPost.nama_karyawan}
          onChange={this.inputChange}
        />
        <input
          type="text"
          name="jabatan"
          placeholder="Masukan Jabatan"
          value={this.state.dataPost.jabatan}
          onChange={this.inputChange}
        />
        <input
          type="text"
          name="jenis_kelamin"
          placeholder="Masukan Jenis Kelamin"
          value={this.state.dataPost.jenis_kelamin}
          onChange={this.inputChange}
        />
        <input
          type="date"
          name="tanggal_lahir"
          value={this.state.dataPost.tanggal_lahir}
          onChange={this.inputChange}
        />
        <button onClick={this.handleSubmit} className="primary">Save Data</button>
        <br />
        <br />
        { this.state.dataApi.map((data,index) => {
          return(
            <div key={index} className="rounded">
              <p>Nama Karyawan: {data.nama_karyawan}</p>
              <p>Jabatan: {data.jabatan}</p>
              <p>Jenis Kelamin: {data.jenis_kelamin}</p>
              <p>Tanggal Lahir: {data.tanggal_lahir}</p>
              <button
                value={data.id}
                onClick={this.handleRemove}
                className="danger"
              >
                Delete
              </button>
              <button
                value={data.id}
                onClick={this.getDataId}
                className="success"
              >
                Edit data
              </button>
            </div>
          );
        })}
      </>
    );
  }
}

export default App;
