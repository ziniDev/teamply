import * as React from 'react';

function SvgCompass(props) {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width='1em'
			height='1em'
			fill='currentColor'
			className='svg-icon'
			viewBox='0 0 16 16'
			{...props}>
			<path d='M8 16.016a7.5 7.5 0 001.962-14.74A1 1 0 009 0H7a1 1 0 00-.962 1.276A7.5 7.5 0 008 16.016zm6.5-7.5a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z' />
			<path d='M6.94 7.44l4.95-2.83-2.83 4.95-4.949 2.83 2.828-4.95z' />
		</svg>
	);
}

export default SvgCompass;
