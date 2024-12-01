export const mockSearchFunction = async (query: string): Promise<any[]> => {
    await new Promise(resolve => setTimeout(resolve, 500))
  
    const mockData = [
      { id: '1', title: 'React Article', type: 'document', content: 'Learn about React hooks and components.' },
      { id: '2', title: 'Next.js Template', type: 'template', content: 'A starter template for Next.js projects.' },
      { id: '3', title: 'CSS Tricks', type: 'document', content: 'Advanced CSS techniques and best practices.' },
      { id: '4', title: 'JavaScript Basics', type: 'course', content: 'Introduction to JavaScript programming.' },
      { id: '5', title: 'TypeScript Guide', type: 'document', content: 'Comprehensive guide to TypeScript features.' },
    ]
  
    return mockData.filter(item => 
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.type.toLowerCase().includes(query.toLowerCase()) ||
      item.content.toLowerCase().includes(query.toLowerCase())
    )
  }