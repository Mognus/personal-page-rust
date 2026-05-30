use serde::Serialize;

const DEFAULT_PAGE: u32 = 1;
const DEFAULT_PAGE_SIZE: u32 = 20;
const MAX_PAGE_SIZE: u32 = 100;

#[derive(Debug, Clone, Copy)]
pub struct Pagination {
    pub page: u32,
    pub page_size: u32,
}

impl Pagination {
    // Normalize raw query params into safe database limit/offset values.
    pub fn new(page: Option<u32>, page_size: Option<u32>) -> Self {
        Self {
            page: page.unwrap_or(DEFAULT_PAGE).max(1),
            page_size: page_size.unwrap_or(DEFAULT_PAGE_SIZE).clamp(1, MAX_PAGE_SIZE),
        }
    }

    pub fn limit(self) -> i64 {
        i64::from(self.page_size)
    }

    pub fn offset(self) -> i64 {
        i64::from(self.page - 1) * i64::from(self.page_size)
    }
}

#[derive(Debug, Serialize)]
pub struct PaginatedResponse<T> {
    pub items: Vec<T>,
    pub page: u32,
    pub page_size: u32,
    pub total: i64,
    pub total_pages: i64,
}

impl<T> PaginatedResponse<T> {
    pub fn new(items: Vec<T>, pagination: Pagination, total: i64) -> Self {
        Self {
            items,
            page: pagination.page,
            page_size: pagination.page_size,
            total,
            total_pages: calculate_total_pages(total, pagination.page_size),
        }
    }
}

fn calculate_total_pages(total: i64, page_size: u32) -> i64 {
    let page_size = i64::from(page_size);

    (total + page_size - 1) / page_size
}
