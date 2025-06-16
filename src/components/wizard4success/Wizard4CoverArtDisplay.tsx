
import React from "react";

interface Wizard4CoverArtDisplayProps {
  coverBase64: string | null | undefined;
  coverIpfs: string | null;
}

export const Wizard4CoverArtDisplay: React.FC<Wizard4CoverArtDisplayProps> = ({
  coverBase64,
  coverIpfs,
}) => {
  if (!coverBase64 && !coverIpfs) return null;

  return (
    <div className="w-full flex flex-col items-center">
      <label className="mb-1 text-sm text-body-text/60">Your Cover Art:</label>
      <a
        href={coverIpfs ? `https://ipfs.io/ipfs/${coverIpfs}` : undefined}
        target="_blank"
        rel="noopener noreferrer"
        tabIndex={0}
        aria-label="Open uploaded cover on IPFS"
        className="block rounded border-2 border-accent shadow-lg p-1 max-w-[240px] hover:scale-105 transition mb-2"
        style={{ pointerEvents: coverIpfs ? "auto" : "none", opacity: coverIpfs ? 1 : 0.7 }}
      >
        <img
          src={coverBase64 || (coverIpfs ? `https://ipfs.io/ipfs/${coverIpfs}` : "")}
          alt="Uploaded Cover Art"
          className="rounded max-h-48 w-auto"
        />
      </a>
      {coverIpfs && (
        <small className="text-xs text-accent">
          <a href={`https://ipfs.io/ipfs/${coverIpfs}`} target="_blank" rel="noopener noreferrer">
            View on IPFS
          </a>
        </small>
      )}
    </div>
  );
};
