export const TableButtonAction = ({ onClick, button }) => {
    return (
        <button
            onClick={onClick}
            className={`inline-flex items-center text-${button.color}-600 hover:text-${button.color}-900 mr-3`}
            title={button.title}
        >
            {button.icon}
        </button>
    );
};
