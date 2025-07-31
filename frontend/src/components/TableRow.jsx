const TableRow = ({ selectedItems, id, children }) => {
    return (
        <tr
            className={`border-b bg-white border-gray-200 transition-colors text-xs text-gray-500 text-center hover:bg-gray-50 ${
                selectedItems?.includes(id) ? "bg-gray-50" : ""
            }`}
        >
            {children}
        </tr>
    );
};

export default TableRow;
