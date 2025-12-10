// Stub AI service - returns a generated string
export async function generateJobDescription(title, keywords = '') {
  const kw = keywords || '';
  return `We are hiring a ${title}. Key skills: ${kw}. Apply now.`;
}
