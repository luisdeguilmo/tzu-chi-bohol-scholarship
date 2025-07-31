const PageContent = ({ children }) => {
    return (
        <div className="lg:p-6">
            <div className="w-[100%] mx-auto bg-white rounded-md shadow p-6">
                {children}
            </div>
        </div>
    );
};

export default PageContent;
