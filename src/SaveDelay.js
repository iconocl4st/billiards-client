import { useState } from 'react';


// The heck is this thing, why does it have to be capitol?
const SaveDelay = (data, networkSave, refresh) => {
	const AutoSaveDelay = 1000;
	const [delayState, setDelayState] = useState({
		internalState: data,
		hasModifications: false,
		hasTimeOut: false,
	});
	const {internalState, hasTimeOut, hasModifications, timeOutVar} = delayState;
	const value = hasModifications ? internalState : data;

	const save = async newValue => {
		console.log('about to call network save');
		setDelayState({
			internalState: newValue,
			hasModifications: false,
			hasTimeOut: false,
		});
		await networkSave(newValue);
		await refresh();
		setDelayState({
			internalState: newValue,
			hasModifications: false,
			hasTimeOut: false,
		});
	};
	const setValue = newValue => {
		if (hasTimeOut) {
			window.clearTimeout(timeOutVar);
		}
		setDelayState({
			internalState: newValue,
			hasModifications: true,
			hasTimeOut: true,
			timeOutVar: window.setTimeout(() => save(newValue), AutoSaveDelay),
		});
	};
	return { value, setValue, hasModifications };
};


export default SaveDelay;
