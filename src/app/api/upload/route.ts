import { NextRequest, NextResponse } from 'next/server';
import cloudinary from '../../../utils/cloudinary';

export async function POST(request: NextRequest) {
    try {
      const { image } = await request.json();
  
      const uploadResponse = await cloudinary.uploader.upload(image, {
        upload_preset: 'q1bc4njf', 
      });
  
      return NextResponse.json({ url: uploadResponse.secure_url });
    } catch (error) {
      console.error('Error uploading image:', error);
      return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
    }
  }
