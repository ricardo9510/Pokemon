import React from 'react';
import Slider from '@material-ui/core/Slider'
import "./style.css";
import searchIcon from "../assets/images/search.svg";
import plusIcon from "../assets/images/plus.png";
import multiple from "../assets/images/multiple.png";
import save from "../assets/images/save.png";
import edit from "../assets/images/edit.png";
import Delete from "../assets/images/delete.png";
import SuperAgent from 'superagent';
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "w3-css/3/w3.css"

export default class App extends React.Component {
  constructor(props) {
    super();
    this.state = {
      hide: 0,
      saveN: "",
      saveI: "",
      mapOk: 0,
      edit: 0,
      datas: [],
      editID: "",
      editName: "",
      editImage: "",
      editAttack: 0,
      editDefense: 0,
    }
  }
  componentWillMount() {
    (async () => {
      try {
        const res = await SuperAgent.get('https://bp-pokemons.herokuapp.com/?idAuthor=1');
        this.setState({ datas: JSON.parse(res['text']), mapOk: 1 });
        console.log(this.state.datas);
      } catch (err) {
        console.error(err);
      }
    })();
  }
  show = () => {
    this.setState({ editID: "", editName: "", editImage: "", editAttack: "", editDefense: "", hide: 1, edit: 0 });
  }
  hide() {
    this.setState({ hide: 0 });
  }
  edit(data1) {
    this.setState({ editID: data1['id'], editName: data1['name'], editImage: data1['image'], editAttack: data1['attack'], editDefense: data1['defense'], hide: 1, edit: 1 });
  }
  delete(id) {
    console.log(id);
    axios.delete(`https://bp-pokemons.herokuapp.com/${id}`)
      .then(response => {
        console.log(response);
      })
  }

  save() {
    if (this.state.editName != "" && this.state.editImage != "" && this.state.edit == 1) {
      var id = this.state.editID;
      axios.put(`https://bp-pokemons.herokuapp.com/${id}`, {
        name: this.state.editName,
        image: this.state.editImage,
        attack: this.state.editAttack,
        defense: this.state.editDefense,
        hp: 0,
        type: "pokemon",
        idAuthor: 1,
      }).then(response => {
        console.log(response);
        if (response.status == 200) {
          this.setState({ hide: 0 });
        }
      }).catch(
        err => console.log(err));
    } else if (this.state.editName != "" && this.state.editImage != "" && this.state.edit == 0) {
      axios.post(`https://bp-pokemons.herokuapp.com/?idAuthor=1`,
        {
          name: this.state.saveN,
          image: this.state.saveI,
          attack: "100",
          defense: "100",
          hp: "0",
          type: "pokemon",
          idAuthor: "1",
          id: "4395"
        }
      ).then(
        (response) => {
          console.log(response);
        }
      ).catch(
        err => console.log(err));
    }
  }
  handleName(event) {
    this.setState({ saveN: event.target.value, editName: event.target.value });
  }
  handleImage(event) {
    this.setState({ saveI: event.target.value, editImage: event.target.value });
  }
  sliderUp(val) {
  }
  myFunction() {
    var input, filter, table, tr, td, i;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    table = document.getElementById("myTable");
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
      td = tr[i].getElementsByTagName("td")[0];
      if (td) {
        var txtValue = td.textContent || td.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = "";
        } else {
          tr[i].style.display = "none";
        }
      }
    }
  }

  render() {
    return (
      <div className='body'>
        <p className='searchTitle'>Listado de Pokemon</p>
        <input type="text" onKeyUp={() => this.myFunction()} placeholder="Buscar" className='searchInput' id="myInput" />
        <img src={searchIcon} alt="search" className='searchIcon' />
        <div className='plusButton' onClick={this.show.bind(this)}>
          <img src={plusIcon} alt="plus" className='plusImg' />
          <p className='plusBL'>Nuevo</p>
        </div>
        <table className='table table-bordered table-hover' id="myTable">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>imagen</th>
              <th>Ataque</th>
              <th>Defensa</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {
              this.state.mapOk != 0 ? this.state.datas.map((data) => {
                return <tr><td>{data['name']}</td><td><img style={{ width: '30px' }} src={data['image']} /></td><td>{data['attack']}</td><td>{data['defense']}</td><td><img style={{ width: '20px', cursor: 'pointer' }} onClick={() => this.edit(data)} src={edit} /> <img onClick={() => this.delete(data['id'])} style={{ width: '20px', marginLeft: '30px', cursor: 'pointer' }} src={Delete} /></td></tr>
              }) :
                <tr><td></td><td></td><td></td><td></td><td></td></tr>
            }
          </tbody>
        </table>
        <div className={this.state.hide == 0 ? 'add hide' : 'add show'}>
          <p className='addTitle'>Nuevo Pokemon</p>
          <div className='addLR'>
            <div className='addLeft'>
              <div className='addLN'>
                <p>Nombre:</p>
                <input type="text" value={this.state.editName} className='searchInput addNameI' onChange={this.handleName.bind(this)} />
              </div>
              <div className='addLN' style={{ marginTop: '30px' }}>
                <p style={{ width: '58.06px' }}>imagen:</p>
                <input type="text" value={this.state.editImage} className='searchInput addNameI' onChange={this.handleImage.bind(this)} />
              </div>
            </div>
            <div className='addRight'>
              <div className='sliderDiv'>
                <p className='sliderp'>Ataque: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0</p>
                <Slider className='sliderup'
                  size="small"
                  defaultValue={0}
                  aria-label="Small"
                  valueLabelDisplay="auto"
                  onChange={this.sliderUp.bind(this)}
                />
                100
              </div>
              <div className='sliderDiv' style={{ marginTop: '20px' }}>
                <p className='sliderp'>Defensa: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0</p>
                <Slider className='sliderup'
                  size="small"
                  defaultValue={0}
                  aria-label="Small"
                  valueLabelDisplay="auto" />
                100
              </div>
            </div>
          </div>
          <div className='addButtons'>
            <div className={(this.state.saveI != "" && this.state.saveN != "") || (this.state.editName != "" && this.state.editImage != "") ? 'addBSave' : 'addBSave disable'} onClick={this.save.bind(this)}>
              <img src={save} alt="plus" className='plusImg' />
              <p className='addBL'>Guardar</p>
            </div>
            <div className='addBCancel' onClick={this.hide.bind(this)}>
              <img src={multiple} alt="plus" style={{ width: '13px', height: '13px', marginTop: '10px' }} className='plusImg' />
              <p className='addBL'>Cancelar </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

