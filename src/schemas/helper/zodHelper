
// Helper function to format Zod errors
export const formatZodErrors = (issues: any[]) => {
  return issues.map(issue => ({
    field: issue.path.join('.'),
    message: issue.message,
  }));
};