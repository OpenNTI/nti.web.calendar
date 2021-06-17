import React from 'react';

import { EntryForm } from './EntryForm';

//react.lazy only supports default exports...so make one
export default function NewUser(props) {
	return <EntryForm />;
}
