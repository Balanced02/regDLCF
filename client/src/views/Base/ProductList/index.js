import React, { Component } from "react";
import { Row, Input, InputGroup, InputGroupAddon, Card, CardHeader, CardBlock, CardFooter } from "reactstrap";
import { connect } from "react-redux";
import ProductList from "../../../components/ProductList";
import AdminProductList from '../../../components/AdminProductList'
import { callApi } from "../../../utils/index";
import { showError, showInfo } from "../../../actions/feedback";
import Prompt from "../../../components/Prompt";
import Loading from '../../../components/loading'

class ProductLists extends Component {
  constructor(props) {
    super(props);
    this.toggleFade = this.toggleFade.bind(this);
    this.state = {
      collapse: true,
      fadeIn: true,
      timeout: 300,
      productList: [],
      filteredProducts: [],
      selectedProduct: null,
      showDeletePrompt: false,
      showPremiumPrompt: false,
      searchKey: '',
      page: 1,
      count: 0,
      fetching: true,
      isFetching: false,
      user: this.props.user ? this.props.user.userType ? this.props.user.userType : this.props.user._doc.userType : ''
    };
  }

  toggleFade() {
    this.setState(prevState => {
      return { fadeIn: !prevState };
    });
  }

  deleteProduct() {
    console.log(this.state.selectedProduct)
    const id = this.state.selectedProduct._id;
    if (!id) {
      this.toggleDeletePrompt();
      return;
    }
    this.setState({
      ...this.state,
      isFetching: true,
    })
    callApi(`/deleteProduct/${id}`, this.state.selectedProduct, 'POST')
      .then(() => {
        this.clearIsFetching()
        this.props.dispatch(showInfo("Successfully Deleted"));
        this.getProducts();
        this.toggleDeletePrompt();
        this.clearSelectedState();
      })
      .catch(() => {
        this.clearIsFetching()
        this.props.dispatch(showError("Error deleting, pls refresh the page"));
        this.toggleDeletePrompt();
        this.clearSelectedState();
      });
  }

  clearSelectedState() {
    this.setState({
      ...this.state,
      selectedProduct: null
    });
  }

  togglePremiumContents() {
    const product = this.state.selectedProduct;
    if (!product._id) {
      this.togglePremiumPrompt();
      return;
    }
    this.setState({
      ...this.state,
      isFetching: true,
    })
    callApi("/changePremium", product, "POST")
      .then(() => {
        this.props.dispatch(showInfo("Successfully Changed"));
        this.togglePremiumPrompt();
        this.clearIsFetching()
        this.getProducts(this.state.page)
      })
      .catch(() => {
        this.clearIsFetching()
        this.props.dispatch(showError("Error changing Premium status"));
        this.togglePremiumPrompt();
      });
  }

  clearIsFetching(){
    this.setState({
      ...this.state,
      isFetching: false
    })
  }

  togglePremiumPrompt(product = {}) {
    this.setState(prev => ({
      ...this.state,
      selectedProduct: product,
      showPremiumPrompt: !prev.showPremiumPrompt
    }));
  }

  toggleDeletePrompt(product = {}) {
    this.setState(prev => ({
      ...this.state,
      selectedProduct: product,
      showDeletePrompt: !prev.showDeletePrompt
    }));
  }

  getProducts(id, searchKey = ''){
    callApi(`/getProducts/${id}`, {searchKey: searchKey}, 'POST').then(({products, count}) => {
      this.setState({
        ...this.state,
        productList: products,
        count: count,
        fetching: false
      })
    })
  }

  handleSearchChange(e){
    const {value} = e.target
    this.setState({
      ...this.state,
      searchKey: value
    })
    this.getProducts(1, value)
  }

  loadMoreProducts(){
    this.getProducts(this.state.page + 1, this.state.searchKey)
  }

  componentWillMount(){
    this.getProducts(1)
  }

  render() {
    const deleteConfirmText = this.state.selectedProduct ? (
      <span>
        Delete Title: <strong> {this.state.selectedProduct.title} </strong> of{" "}
        <strong> Username: </strong> {this.state.selectedProduct.username}
      </span>
    ) : (
      ""
    );
    const premiumConfirmText = this.state.selectedProduct ? (
      <span>
        Change Title: <strong> {this.state.selectedProduct.title} </strong> to{" "}
        {this.state.selectedProduct.premium ? "Regular" : "Premium"}?{" "}
      </span>
    ) : (
      ""
    );
    return (
      <div className="animated fadeIn">
        <Card>
          <CardHeader>
        <InputGroup>
        <Input placeholder="Search Products" onChange={e => this.handleSearchChange(e)}  />
        <InputGroupAddon addonType="append">Search</InputGroupAddon>
      </InputGroup>
      </CardHeader>
      <CardBlock>
        <Row>
          { this.state.productList.length && !this.state.fetching ? this.state.productList.map((product, i) => (
            this.state.user === 'admin' ? <AdminProductList
              key={i}
              data={product}
              toggleDeletePrompt={prod => this.toggleDeletePrompt(prod)}
              togglePremiumPrompt={prod => this.togglePremiumPrompt(prod)}
            /> :
            <ProductList
              key={i}
              data={product}
            />
          )) : this.state.fetching ? <Loading /> :
          <CardBlock> Ooops, No Results Found... </CardBlock>
          }
        </Row>
        <Prompt
          show={this.state.showDeletePrompt}
          confirmButtonText="Delete"
          handleConfirmation={(prod) => this.deleteProduct(prod)}
          toggle={(prod) => this.toggleDeletePrompt(prod)}
          confirmText={deleteConfirmText}
          title="Delete"
          fetching={this.state.isFetching}
        />
        <Prompt
          show={this.state.showPremiumPrompt}
          confirmButtonText="Change"
          handleConfirmation={() => this.togglePremiumContents()}
          toggle={() => this.togglePremiumPrompt()}
          confirmText={premiumConfirmText}
          title="Change Premium Content"
          fetching={this.state.isFetching}
        />
        </CardBlock>
          <CardFooter>
            Showing {this.state.productList.length} of {this.state.count} 
          </CardFooter>
      </Card>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.auth.user
  };
};

export default connect(mapStateToProps)(ProductLists);
