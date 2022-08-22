import { types } from 'mobx-state-tree';
import moment from 'moment';
import AuthService from '../services/AuthService';

export const User = types
	.model('User', {
		id: types.maybe(types.number),
		name: types.maybe(types.string),
		email: types.maybe(types.string),
		profile: types.maybe(types.string),
		phone: types.maybe(types.string),
		loginType: types.maybe(types.string),
		createdAt: types.maybe(types.string),
		udpatedAt: types.maybe(types.string),
		currentCompanyId: types.maybe(types.number),
	})
	.views((self) => ({
		get me() {
			return { ...self };
		},
	}))
	.actions((self) => ({
		async authMe() {
			const response = await AuthService.me();
			if (response.data) {
				self.setData(response.data);
			}
		},
		async setData(data) {
			//console.log(data);
			self.id = data.id || self.id;
			self.name = data.name || self.name;
			self.email = data.email || self.email;
			self.profile = data.profile || self.profile;
			self.phone = data.phone || self.phone;
			self.loginType = data.loginType || '';
			self.createdAt = moment(data.createdAt).format('YYYY-MM-DD HH:mm:ss');
			self.udpatedAt = moment(data.udpatedAt).format('YYYY-MM-DD HH:mm:ss');
			if (data.currentCompanyId) self.currentCompanyId = data.currentCompanyId;
		},
		async logout() {
			self.id = 0;
			self.name = '';
			self.email = '';
			self.profile = '';
			self.phone = '';
			self.loginType = '';
			self.createdAt = '';
			self.udpatedAt = '';
			self.currentCompanyId = 0;
		},
	}));

export default User;
