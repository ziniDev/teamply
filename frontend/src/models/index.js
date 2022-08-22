import { getItem, setItem } from '../lib/localstorage';
import { onSnapshot, types } from 'mobx-state-tree';
import { createContext, useContext } from 'react';
import { User } from './User';
import process from 'process';

const RootModel = types.model({
	user: types.maybe(User),
});

let initialState = RootModel.create({
	user: {},
});

if (process.browser) {
	const data = getItem('rootState');
	if (data) {
		const json = JSON.parse(data);
		if (RootModel.is(json)) {
			initialState = RootModel.create(json);
		}
	}
}

export const rootStore = initialState;

onSnapshot(rootStore, (snapshot) => {
	//console.log("Snapshot: ", snapshot)
	setItem('rootState', JSON.stringify(snapshot));
});

const RootStoreContext = createContext(null);

export const { Provider } = RootStoreContext;
export const useMst = () => {
	const store = useContext(RootStoreContext);

	if (store === null) {
		throw new Error('Store cannot be null, please add a context provider');
	}
	return store;
};
