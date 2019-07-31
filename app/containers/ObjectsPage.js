import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Objects from '../components/Objects';
import * as ObjectsActions from '../actions/objects';

function mapStateToProps(state) {
  return {
    objects: state.objects
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ObjectsActions, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Objects);
