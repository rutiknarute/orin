import type { AnalysisResult } from "@/lib/types";

export interface DocumentAnalyzer {
  analyze(filename: string): Promise<AnalysisResult>;
}

/**
 * Deterministic demo adapter. Later, swap this object for a Llama-backed
 * implementation while preserving the same output contract.
 */
export const demoDocumentAnalyzer: DocumentAnalyzer = {
  async analyze(filename) {
    const id = `analysis_${Date.now().toString(36)}`;
    return {
      id,
      filename,
      documentType: "Transaction certificate",
      supplier: "Chromia Works",
      confidence: 94,
      fieldsFound: 11,
      reviewItems: 2,
      extracted: [
        { label: "Certificate", value: "CU-1167824", confidence: 99 },
        { label: "Issued to", value: "Chromia Works S.r.l.", confidence: 97 },
        { label: "Material", value: "Recycled polyester", confidence: 95 },
        { label: "Valid until", value: "30 Sep 2027", confidence: 93 },
        { label: "Dye lot", value: "CW-4492-NVY", confidence: 84 },
        { label: "REACH statement", value: "Human review needed", confidence: 72 },
      ],
    };
  },
};
