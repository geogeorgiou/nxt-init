type LoaderPropsType = {
	show: boolean;
};

//loader component
export default function Loader({ show }: LoaderPropsType) {
	return show ? <div className="loader"></div> : null;
}
