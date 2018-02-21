import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import formFields from './formFields';
import * as actions from '../../actions/index';
import { withRouter } from 'react-router-dom';

const SurveyFormReview = ({
	onCancel,
	formValues,
	submitSurvey,
	history,
}) => {
	const surevyReviewFields = _.map(formFields, field => {
		return (
			<div key={field.name}>
				<label>{field.label}</label>
				<div>{formValues[field.name]}</div>
			</div>
		);
	});
	return (
		<div>
			<h3>Please review your entries!</h3>
			{surevyReviewFields}
			<button
				onClick={onCancel}
				className="yellow btn-flat darken-3 white-text"
			>
				Back
			</button>
			<button
				onClick={() => submitSurvey(formValues, history)}
				className="green btn-flat right white-text"
			>
				Send Survey
				<i className="material-icons right">email</i>
			</button>
		</div>
	);
};

function mapStateToProps(state) {
	return {
		formValues: state.form.surveyForm.values,
	};
}

export default connect(mapStateToProps, actions)(
	withRouter(SurveyFormReview)
);
