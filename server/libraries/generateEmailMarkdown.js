export default function generateEmailMarkdown({to, beginning, url, title, content}) {
  const titleMakrdown = title ? `# ${title}\n` : '';
  return `
Hi ${to},

${beginning}
You can read it [here](${url})

---
${titleMakrdown}

${content}

---

Thanks,<br />KB
  `;
}
