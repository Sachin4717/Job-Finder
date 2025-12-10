export async function generateJobDescription(title, keywords='') {
  return `We are hiring a ${title}. Key skills: ${keywords}.`;
}
export async function optimizeCoverLetter(title, bio) {
  return `Dear Hiring Team, I am excited about ${title}. ${bio.slice(0,200)}`;
}