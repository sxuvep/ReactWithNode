import _ from 'lodash';
import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { Link } from 'react-router-dom';
import SurveyField from './SurveyField';
import validateEmails from '../../utils/emailValidation';
import formFields from './formFields';

class SurveyForm extends Component {
	renderFields() {
		return _.map(formFields, ({ label, name }) => {
			return (
				<Field
					key={name}
					type="text"
					component={SurveyField}
					name={name}
					label={label}
				/>
			);
		});
	}
	render() {
		return (
			<div>
				<form
					onSubmit={this.props.handleSubmit(
						this.props.onSurveySubmit
					)}
				>
					{this.renderFields()}

					<Link
						to="/surveys"
						className="red btn-flat left text-white"
					>
						Cancel
					</Link>

					<button
						className="teal btn-flat right text-white"
						type="submit"
					>
						<i className="material-icons right">done</i>
						Next
					</button>
				</form>
			</div>
		);
	}
}

function validate(values) {
	const errors = {};
	errors.recipients = validateEmails(values.recipients || '');
	_.each(formFields, ({ name, errorMsg }) => {
		if (!values[name]) {
			errors[name] = errorMsg;
		}
	});

	return errors;
}
export default reduxForm({
	validate: validate,
	form: 'surveyForm',
	destroyOnUnmount: false,
})(SurveyForm);
