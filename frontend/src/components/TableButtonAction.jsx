export const TableButtonAction = ({ onClick, button }) => {
    return (
        <button
            onClick={onClick}
            disabled={button.disabled}
            className={`inline-flex items-center text-${button.disabled ? "gray" : button.color}-${button.disabled ? "500" : "600"} hover:text-${button.disabled ? "gray" : button.color}-${button.disabled ? "500" : "900"} mr-3`}
            title={button.title}
        >
            {button.disabled ? "Edit not available" : button.icon}
        </button>
    );
};
