#[derive(Debug)]
pub struct InvalidUserRole {
    pub value: String,
}

impl std::fmt::Display for InvalidUserRole {
    fn fmt(&self, formatter: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(formatter, "invalid user role: {}", self.value)
    }
}

impl std::error::Error for InvalidUserRole {}
