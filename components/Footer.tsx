const Footer = async () => {
	return (
		<footer className="flex justify-between items-center px-5 py-3 bg-black-200 text-white-100 font-work-sans mt-10">
			<div className="text-left font-semibold"><span className="text-primary">YC</span>Directory</div>
			<div className="text-right text-sm">
				 
				All rights reserved. &copy; {new Date().getFullYear()}
			</div>
		</footer>
	);
};

export default Footer;
