
import * as xmlbuilder from './index';
import * as fs from 'fs';

const root = xmlbuilder.create(`<hello>
	<friend> </friend>
</hello>`);

root.removeNonLeafTextNodes();

// convert the XML tree to string
const xml = root.end({ prettyPrint: true });
console.log(xml);
