import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Objects from '../components/Objects';
import * as SharedActions from '../actions/shared';
import * as ObjectsActions from '../actions/objects';

function mapStateToProps(state) {
  return {
    shared: state.shared,
    objects: state.objects
  };
}

function mapDispatchToProps(dispatch) {
  const CombinedActions = {
    ...SharedActions,
    ...ObjectsActions
  };
  return bindActionCreators(CombinedActions, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Objects);
