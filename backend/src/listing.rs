use sqlx::{Postgres, QueryBuilder};

pub struct ColumnFilter {
    pub column: &'static str,
    pub value: String,
}

pub fn push_column_filters(
    builder: &mut QueryBuilder<Postgres>,
    filters: &[ColumnFilter],
) {
    for filter in filters {
        builder
            .push(" AND ")
            .push(filter.column)
            .push(" = ")
            .push_bind(&filter.value);
    }
}

pub fn push_search_filter(
    builder: &mut QueryBuilder<Postgres>,
    search: Option<&str>,
    fields: &[&'static str],
) {
    if let Some(search) = search {
        let pattern = format!("%{search}%");

        builder.push(" AND (");
        for (index, field) in fields.iter().enumerate() {
            if index > 0 {
                builder.push(" OR ");
            }

            builder.push(*field).push(" ILIKE ").push_bind(&pattern);
        }
        builder.push(")");
    }
}
