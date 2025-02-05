interface PageResponse<T> {
    data: T[],
    currentPage: number,
    totalPages: number,
    pageSize: number,
    totalItems: number
}

export default PageResponse;