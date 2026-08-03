import { SupabaseClient } from "@supabase/supabase-js";

/**
 * Uploads a PDF Buffer to a private Supabase Storage bucket and returns a 24-hour signed URL.
 */
export async function uploadPayslipToPrivateStorage({
  supabase,
  runId,
  payslipId,
  pdfBuffer,
}: {
  supabase: SupabaseClient;
  runId: string;
  payslipId: string;
  pdfBuffer: Buffer;
}): Promise<{ filePath: string; signedUrl: string }> {
  const bucketName = "payslips";
  const filePath = `${runId}/${payslipId}.pdf`;

  console.log(`☁️ [SUPABASE STORAGE] Uploading PDF (${pdfBuffer.length} bytes) to private bucket 'payslips' at path: "${filePath}"...`);

  // 1. Upload Buffer using the Supabase client
  const { error: uploadError } = await supabase.storage
    .from(bucketName)
    .upload(filePath, pdfBuffer, {
      contentType: "application/pdf",
      upsert: true,
    });

  if (uploadError) {
    console.warn(`⚠️ [SUPABASE STORAGE] Initial upload notice: ${uploadError.message}`);
    // If bucket does not exist yet, attempt to create it as a private bucket
    if (
      uploadError.message?.toLowerCase().includes("bucket not found") ||
      uploadError.message?.toLowerCase().includes("does not exist")
    ) {
      console.log(`📦 [SUPABASE STORAGE] Private bucket '${bucketName}' missing. Creating bucket now...`);
      await supabase.storage.createBucket(bucketName, { public: false });

      // Retry upload after bucket creation
      const { error: retryError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, pdfBuffer, {
          contentType: "application/pdf",
          upsert: true,
        });

      if (retryError) {
        console.error(`❌ [SUPABASE STORAGE] Retry upload failed: ${retryError.message}`);
        throw new Error(`Failed to upload PDF after creating bucket: ${retryError.message}`);
      }
    } else {
      console.error(`❌ [SUPABASE STORAGE] Upload failed: ${uploadError.message}`);
      throw new Error(`Failed to upload PDF to Supabase Storage: ${uploadError.message}`);
    }
  }

  console.log(`✅ [SUPABASE STORAGE] File uploaded successfully to '${filePath}'! Generating 24-hour signed URL...`);

  // 2. Generate a 24-hour Signed URL
  const { data: signedData, error: signedError } = await supabase.storage
    .from(bucketName)
    .createSignedUrl(filePath, 60 * 60 * 24); // 24 hours in seconds

  if (signedError || !signedData?.signedUrl) {
    console.error(`❌ [SUPABASE STORAGE] Signed URL generation error: ${signedError?.message}`);
    throw new Error(`Failed to generate signed URL: ${signedError?.message || "Unknown error"}`);
  }

  console.log(`🔗 [SUPABASE STORAGE] Signed URL generated successfully for '${filePath}'!`);

  return {
    filePath,
    signedUrl: signedData.signedUrl,
  };
}
