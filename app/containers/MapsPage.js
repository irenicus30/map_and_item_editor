import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Maps from '../components/Maps';
import * as SharedActions from '../actions/shared';
import * as MapsActions from '../actions/maps';

function mapStateToProps(state) {
  return {
    shared: state.shared,
    maps: state.maps
  };
}

function mapDispatchToProps(dispatch) {
  const CombinedActions = {
    ...SharedActions,
    ...MapsActions
  };
  return bindActionCreators(CombinedActions, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Maps);
