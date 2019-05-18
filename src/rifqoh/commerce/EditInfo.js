import React, { Component } from "react";

import Loading from "react-spinners/BeatLoader";
import Nav from "../navTypes/commerceNav";
import Token from "../utils";
import axios from "axios";
import url from "../url";

export default class EditInfo extends Component {
  state = {
    name: "",
    logo: "",
    logoName: "",
    address: "",
    description: "",
    loading: true
  };
  fileInput = React.createRef();

  componentDidMount() {
    // TODO: implement an api route to get user info
    // And prefill it
    axios
      .get(`${url}/api/get_info/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${Token()}`
        }
      })
      .then(res => {
        this.setState({
          name: res.data.title,
          address: res.data.address,
          description: res.data.description,
          loading: false
        });
      });
  }

  // Handle text typed in by the user.
  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  // Handle the uploaded file
  // and update it to the state
  handelOnUploadFile = event => {
    this.setState({
      logo: event.target.files[0],
      logoName: event.target.files[0].name
    });
  };

  // Submits the form data to the API
  // And does some cool animation
  handleSubmit = event => {
    event.preventDefault();
    event.target.value = null;
    this.setState({
      loading: true
    });

    // Stop the form from submitting
    // Get the data from the form state.
    const { name, logo, address, description } = this.state;

    // Create form data object
    const data = new FormData();
    data.append("name", name);
    data.append("logo", logo);
    data.append("address", address);
    data.append("description", description);

    // Send a post request to the server with
    // needed information
    axios
      .post(`${url}/api/save_info/`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${Token()}`
        }
      })
      .then(res => {
        this.setState({
          loading: false,
          logoName:""
        });
        localStorage.setItem("logo", res.data.img);
      })
      .catch(error => {
        this.setState({
          error: true,
          loading: false
        });
      });
  };

  render() {
    const shopName = localStorage.getItem("shopName");
    const { name, address, description, loading, logoName } = this.state;
    return (
      <div>
        <Nav name={shopName} />
        <div className="col-md-6 offset-md-3 mt-2">
          <div className="bg-white p-4">
            {loading ? (
              <div className="text-center">
                <Loading />
              </div>
            ) : (
              <div>
                <h3 className="text-center">Edit Store</h3>

                <form onSubmit={this.handleSubmit}>
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-control"
                      id="exampleInputEmail1"
                      aria-describedby="emailHelp"
                      placeholder="Store Name"
                      onChange={this.handleChange}
                      name="name"
                      value={name}
                      disabled
                    />
                  </div>
                  <div className="form-group">
                    <textarea
                      className="form-control"
                      rows="3"
                      placeholder="Address"
                      onChange={e => this.handleChange(e)}
                      defaultValue={address}
                      name="address"
                    />
                  </div>
                  <div className="form-group">
                    <textarea
                      className="form-control"
                      rows="3"
                      onChange={e => this.handleChange(e)}
                      placeholder="Description"
                      defaultValue={description}
                      name="description"
                    />
                  </div>
                  <label>Store logo</label>
                  <input
                    type="file"
                    name="file"
                    id="file"
                    className="inputfile"
                    accept=".png, .jpg, .jpeg"
                    ref={this.fileInput}
                    onChange={this.handelOnUploadFile}
                  />
                  <label htmlFor="file">
                    {logoName ? logoName : "Choose a file"}
                  </label>
                  <button className="btn btn-dark btn-block">Submit</button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}