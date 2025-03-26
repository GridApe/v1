import { handleApiRequest } from '@/lib/api-utils';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json(
        {
          status: false,
          message: 'Validation failed',
          errors: {
            file: ['The file field is required.']
          }
        },
        { status: 422 }
      );
    }

    // Create a new FormData instance for the API request
    const apiFormData = new FormData();
    apiFormData.append('file', file);

    // Forward the request to the API
    return handleApiRequest(request, '/user/contacts/bulk-upload', {
      method: 'POST',
      body: apiFormData,
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  } catch (error) {
    console.error('Bulk upload error:', error);
    return NextResponse.json(
      {
        status: false,
        message: 'Failed to process file upload',
        errors: {
            general: ['An error occurred while processing the file upload.']
        }
      },
      { status: 500 }
    );
  }
}
