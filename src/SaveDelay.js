import { useState } from 'react';


// Rename to lower
const SaveDelay = (
	defaultValue, data, networkSave, {loading, error, refetch}
) => {
	const AutoSaveDelay = 1000;
	const [delayState, setDelayState] = useState({
		internalState: defaultValue,
		hasModifications: false,
		hasTimeOut: false
	});
	const {internalState, hasTimeOut, hasModifications, timeOutVar} = delayState;
	const value = (hasModifications || loading || error) ? internalState : data;

	const save = async newValue => {
		setDelayState({
			internalState: newValue,
			hasModifications: false,
			hasTimeOut: false,
		});
		await networkSave(newValue);
		await refetch();
	};
	const setValue = newValue => {
		if (hasTimeOut) {
			window.clearTimeout(timeOutVar);
		}
		console.log('in setValue', newValue);
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
