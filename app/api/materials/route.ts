import {NextResponse} from 'next/server';
import {createClient} from '@supabase/supabase-js';

export async function GET(){
 const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
 const key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
 if(!url||!key)return NextResponse.json([], {status:200});
 const supabase=createClient(url,key,{auth:{persistSession:false}});
 const {data:version,error:vErr}=await supabase.from('content_versions').select('id').eq('is_published',true).order('published_at',{ascending:false}).limit(1).maybeSingle();
 if(vErr||!version)return NextResponse.json([],{status:200});
 const {data,error}=await supabase.from('training_materials').select('id,title,body,sort_order,category,image_url,media_url,media_type').eq('version_id',version.id).eq('active',true).order('sort_order');
 if(error)return NextResponse.json([],{status:200});
 return NextResponse.json((data||[]).map(x=>({id:x.id,title:x.title,body:x.body||'',category:x.category||'starters',image_url:x.image_url||null,media_url:x.media_url||null,media_type:x.media_type||null})));
}
