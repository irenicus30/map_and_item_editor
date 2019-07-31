import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Maps from '../components/Maps';
import * as MapsActions from '../actions/maps';

function mapStateToProps(state) {
  return {
    maps: state.maps
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(MapsActions, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Maps);
