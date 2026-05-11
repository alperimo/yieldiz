import React, { useEffect, useMemo, useState } from 'react';
import { Spinner } from '../components/ui/Spinner';

function createAnchor(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function appendBlock(blocks, line) {
  if (line.startsWith('- ')) {
    const item = line.slice(2).trim();
    const lastBlock = blocks[blocks.length - 1];
    if (lastBlock?.type === 'list') {
      lastBlock.items.push(item);
    } else {
      blocks.push({ type: 'list', items: [item] });
    }
    return;
  }

  blocks.push({ type: 'paragraph', text: line });
}

function parseLegalText(source) {
  const lines = source.split(/\r?\n/).map((line) => line.trimEnd());
  const firstContentIndex = lines.findIndex((line) => line.trim().length > 0);
  const title = firstContentIndex >= 0 ? lines[firstContentIndex].trim() : 'Legal';
  const remaining = lines.slice(firstContentIndex + 1);

  let lastUpdated = '';
  const introBlocks = [];
  const sections = [];
  let currentSection = null;

  remaining.forEach((rawLine) => {
    const line = rawLine.trim();
    if (!line) return;

    if (!lastUpdated && line.startsWith('Last updated:')) {
      lastUpdated = line.replace('Last updated:', '').trim();
      return;
    }

    const sectionMatch = line.match(/^(\d+)\.\s+(.+)$/);
    if (sectionMatch) {
      currentSection = {
        heading: sectionMatch[2].trim(),
        anchor: createAnchor(sectionMatch[2]),
        blocks: [],
      };
      sections.push(currentSection);
      return;
    }

    if (currentSection) {
      appendBlock(currentSection.blocks, line);
      return;
    }

    appendBlock(introBlocks, line);
  });

  return { title, lastUpdated, introBlocks, sections };
}

function BlockRenderer({ block }) {
  if (block.type === 'list') {
    return (
      <ul className="list-disc space-y-2 pl-5 text-[15px] leading-7 text-[#654B2B]">
        {block.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    );
  }

  return <p className="text-[15px] leading-7 text-[#654B2B]">{block.text}</p>;
}

export default function LegalDocument({ sourcePath, eyebrow = 'Legal' }) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    setLoading(true);
    setError('');

    fetch(sourcePath)
      .then((response) => {
        if (!response.ok) throw new Error(`Unable to load ${sourcePath}`);
        return response.text();
      })
      .then((text) => {
        if (!active) return;
        setContent(text);
      })
      .catch((err) => {
        if (!active) return;
        setError(err.message || 'Unable to load this document.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [sourcePath]);

  const document = useMemo(() => parseLegalText(content), [content]);

  return (
    <section data-header-theme="light" className="border-b border-black/[0.05] bg-[#F5F7F2]">
      <div className="mx-auto max-w-[960px] px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        <div className="rounded-[32px] border border-black/[0.06] bg-white/88 p-6 shadow-[0_24px_80px_rgba(42,26,11,0.06)] sm:p-8 lg:p-12">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#8B6A3A]">{eyebrow}</p>

          {loading ? (
            <div className="flex items-center gap-3 py-14 text-[#654B2B]">
              <Spinner size={22} />
              <span className="text-sm font-medium">Loading document...</span>
            </div>
          ) : error ? (
            <div className="mt-6 rounded-2xl border border-[#D6A84F]/30 bg-[#F8E6B6]/35 px-4 py-3 text-sm text-[#654B2B]">
              {error}
            </div>
          ) : (
            <div className="mt-4">
              <h1 className="font-display text-[34px] font-semibold leading-tight text-[#2A1A0B] sm:text-[42px]">
                {document.title}
              </h1>
              {document.lastUpdated ? (
                <p className="mt-3 text-sm font-medium text-[#8B6A3A]">Last updated: {document.lastUpdated}</p>
              ) : null}

              {document.introBlocks.length ? (
                <div className="mt-8 space-y-4">
                  {document.introBlocks.map((block, index) => (
                    <BlockRenderer key={`${block.type}-${index}`} block={block} />
                  ))}
                </div>
              ) : null}

              <div className="mt-10 space-y-8">
                {document.sections.map((section) => (
                  <article key={section.anchor} id={section.anchor} className="scroll-mt-28">
                    <h2 className="font-display text-[24px] font-semibold text-[#2A1A0B]">
                      {section.heading}
                    </h2>
                    <div className="mt-3 space-y-4">
                      {section.blocks.map((block, index) => (
                        <BlockRenderer key={`${section.anchor}-${block.type}-${index}`} block={block} />
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
