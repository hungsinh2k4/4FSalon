
interface PaginationProps {
    prev: boolean;
    last: boolean;
    next: boolean;
    first: boolean;
    total: number;
    limit: number;
    displayLimit?: number;
    activePage: number;
    onChangePage: (page: number) => void;
}

const buttonStyle = `px-2 py-1 w-fit min-w-8 h-8 rounded-md items-center justify-center enabled:hover:bg-gray-300 focus:outline-none disabled:opacity-30 disabled:cursor-not-allowed`;

const pageDisplay = 3;

const Pagination:React.FC<PaginationProps> = ({ prev, last, next, first, total, limit, activePage, onChangePage: onPageChange }) => {
    const pages = Math.ceil(total / limit);

    if (pages <= 1) return null;

    const renderFirst = () => {
        if (!first) return null;
        return (
            <button
                onClick={() => onPageChange(1)}
                disabled={activePage === 1}
                className={buttonStyle}
            >
                <svg fill="none" width="20px" height="20px" viewBox="0 0 24 24" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path id="primary" d="M 17 19 L 10 12.5 L 17 6 M 12 6 L 5 12.5 L 12 19"></path>
                </svg>
            </button>
        )
    }

    const renderLast = () => {
        if (!last) return null;
        return (
            <button
                onClick={() => onPageChange(pages)}
                disabled={activePage === pages}
                className={buttonStyle}
            >
                <svg fill="none" width="20px" height="20px" viewBox="0 0 24 24" stroke="currentColor" xmlns="http://www.w3.org/2000/svg" className="black">
                <path id="primary" d="M 5.5 4 L 12.5 10.5 L 5.5 17 M 10.5 17 L 17.5 10.5 L 10.5 4"></path>
                </svg>
            </button>
        )
    }

    const renderPrev = () => {
        if (!prev) return null;
        return (
            <button
                onClick={() => onPageChange(activePage - 1)}
                disabled={activePage === 1}
                className={buttonStyle}
            >
                <svg fill="none" width="20px" height="20px" viewBox="0 0 24 24" stroke="currentColor" xmlns="http://www.w3.org/2000/svg" className="black">
                <path id="primary" d="M 13.5 19 L 6.5 12.5 L 13.5 6"></path>
                </svg>
            </button>
        )
    }

    const renderNext = () => {
        if (!next) return null;
        return (
            <button
                onClick={() => {
                    if (activePage === pages) return;
                    onPageChange(activePage + 1);
                }}
                disabled={activePage === pages}
                className={buttonStyle}
            >
                <svg fill="none" width="20px" height="20px" viewBox="0 0 24 24" stroke="currentColor" xmlns="http://www.w3.org/2000/svg" className="black">
                <path id="primary" d="M 7.5 4 L 14.5 10.5 L 7.5 17"></path>
                </svg>
            </button>
        )
    }

    const handleLowLimit = () => {
        if (activePage <= 2) return 2;
        if (activePage >= pages - pageDisplay) return pages - pageDisplay;
        return activePage - 1;
    }

    const handleHighLimit = () => {
        if (activePage <= pageDisplay) return pageDisplay + 2;
        if (activePage >= pages - 2) return pages;
        return activePage + pageDisplay - 1;
    } 

    const renderPage = () => {
        return (
            <div className="flex items-center justify-center gap-4">
                <button
                    onClick={() => onPageChange(1)}
                    className={`${buttonStyle} ${activePage === 1 ? 'bg-gray-300' : ''}`}
                >
                    1
                </button>
                <span className={`text-gray-600 ${activePage >= pageDisplay ? 'block' : 'hidden'}`}>...</span>
                {[...Array(pages)].slice(handleLowLimit(), handleHighLimit()).map((_, index) => (
                    <button
                        key={handleLowLimit() + index}
                        onClick={() => {
                            if (activePage === handleLowLimit() + index) return;
                            onPageChange(handleLowLimit() + index);
                        }}
                        className={`${buttonStyle} ${activePage === handleLowLimit() + index ? 'bg-gray-300' : ''}`}
                    >
                        {handleLowLimit() + index}
                    </button>
                ))}
                <span className={`text-gray-600 ${activePage < pages - pageDisplay ? 'block' : 'hidden'}`}>...</span>
                <button
                    onClick={() => onPageChange(pages)}
                    className={`${buttonStyle} ${activePage === pages ? 'bg-gray-300' : ''}`}
                >
                    {pages}
                </button>
            </div>
        )
    }

    return (
        <div className="flex items-center justify-center gap-4">
            {renderFirst()}
            {renderPrev()}
            {renderPage()}
            {renderNext()}
            {renderLast()}
        </div>
    );
}

export default Pagination;