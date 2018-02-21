const _ = require('lodash');
const Path = require('path-parser');
const { URL } = require('url');
const requireLogin = require('../middlewares/requireLogin');
const requireCredits = require('../middlewares/requireCredits');
const mongoose = require('mongoose');
const Survey = mongoose.model('surveys');
const Mailer = require('../services/Mailer');
const surveyTemplate = require('../services/emailTemplates/surveyTemplate');

module.exports = app => {
	app.get('/api/surveys/:surveyId/:choice', (req, res) => {
		res.send('Thank you for your feedback!!');
	});

	//this route is for sendgrid webhook
	app.post('/api/surveys/webhooks', (req, res) => {
		const p = new Path('/api/surveys/:surveyId/:choice');

		_.chain(req.body)
			.map(({ url, email }) => {
				const match = p.test(new URL(url).pathname);
				if (match) {
					return {
						email: email,
						surveyId: match.surveyId,
						choice: match.choice,
					};
				}
			})
			.compact() //eliminate undefined ones
			.uniqBy('email', 'surveyId') //elimate duplicates
			.each(({ surveyId, email, choice }) => {
				Survey.updateOne(
					{
						_id: surveyId,
						recipients: {
							$elemMatch: {
								email: email,
								responded: false,
							},
						},
					},
					{
						$inc: { [choice]: 1 },
						$set: { 'recipients.$.responded': true },
						lastResponded: new Date(),
					}
				).exec(); //find survey with exact email and responded false and update the record
			})
			.value();

		console.log(events);

		//send response to sendgrid

		res.send({});
	});

	app.post(
		'/api/surveys',
		requireLogin,
		requireCredits,
		async (req, res) => {
			const { title, subject, body, recipients } = req.body;

			const survey = new Survey({
				title,
				subject,
				body,
				recipients: recipients
					.split(',')
					.map(email => ({ email: email.trim() })),
				_user: req.user.id,
				dateSent: Date.now(),
			});

			const mailer = new Mailer(survey, surveyTemplate(survey));
			try {
				await mailer.send();
				await survey.save();
				req.user.credits -= 1;
				const user = await req.user.save();
				res.send(user);
			} catch (error) {
				res.status(422).send(err);
			}
		}
	);
};
