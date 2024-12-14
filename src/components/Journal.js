import React, { useState, useEffect, useRef } from 'react';
import debounce from 'lodash/debounce';

const Journal = ({ dateKey, supabase }) => {
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('');
  const textareaRef = useRef(null); // Reference for the textarea element

  // Save content with debounce
  const saveContent = debounce(async (newContent) => {
    // setStatus('Saving...');
    
    await supabase
      .from('journals')
      .upsert(
        { 
          date: dateKey, 
          content: newContent 
        }, 
        { 
          onConflict: 'date',
          ignoreDuplicates: false 
        }
      );
      
    setStatus('');
  }, 1000);

  useEffect(() => {
    const loadContent = async () => {
      const { data } = await supabase
        .from('journals')
        .select('content')
        .eq('date', dateKey)
        .maybeSingle();
        
      setContent(data?.content || '');
    };

    loadContent();
  }, [dateKey, supabase]);

  // Adjust textarea height dynamically
  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; // Reset height
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Adjust to content
    }
  };

  // Adjust height whenever content changes
  useEffect(() => {
    adjustTextareaHeight();
  }, [content]);

  return (
    <div className="journal-container">
      <div className="flex justify-between mb-2">
        <h3 className="text-sm font-medium">Journal</h3>
        <span className="text-sm text-gray-500">{status}</span>
      </div>
      
      <textarea
        ref={textareaRef} // Attach ref to the textarea
        className="block w-full min-h-[200px] border-0 p-0 text-sm focus:ring-0 focus:outline-none resize-none"
        placeholder="Write your thoughts..."
        value={content}
        onChange={(e) => {
          setContent(e.target.value);
          saveContent(e.target.value);
        }}
      />
    </div>
  );
};

export default Journal;
