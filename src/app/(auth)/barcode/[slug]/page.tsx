import BarcodePage from './barcode-view';

export default async function Page({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <BarcodePage slug={slug} />;
}
