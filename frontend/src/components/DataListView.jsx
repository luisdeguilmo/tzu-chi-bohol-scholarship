export const DataListView = ({ children }) => {
    return (
        <div className="bg-gray-50 lg:p-6">
            <div className="w-[100%] min-h-[90vh] md:min-h-0 mx-auto bg-white rounded-md shadow p-4 md:p-6">
                {children}
            </div>
        </div>
    );
};
