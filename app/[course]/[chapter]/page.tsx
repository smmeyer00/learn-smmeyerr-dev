import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { courses, getChapter } from "@/content";
import { ChapterView } from "@/components/course/chapter-view";

export function generateStaticParams() {
  return courses.flatMap((course) =>
    course.chapters.map((chapter) => ({
      course: course.slug,
      chapter: chapter.slug,
    })),
  );
}

export async function generateMetadata({
  params,
}: PageProps<"/[course]/[chapter]">): Promise<Metadata> {
  const { course: courseSlug, chapter: chapterSlug } = await params;
  const found = getChapter(courseSlug, chapterSlug);
  if (!found) return {};

  const title = `${found.chapter.title} | ${found.course.title} | Learn`;
  return {
    title,
    description: found.chapter.outcome,
    alternates: {
      canonical: `/${found.course.slug}/${found.chapter.slug}`,
    },
    openGraph: {
      title,
      description: found.chapter.outcome,
      url: `/${found.course.slug}/${found.chapter.slug}`,
      siteName: "Learn",
      type: "article",
    },
  };
}

export default async function ChapterPage(
  props: PageProps<"/[course]/[chapter]">,
) {
  const { course: courseSlug, chapter: chapterSlug } = await props.params;
  const found = getChapter(courseSlug, chapterSlug);
  if (!found) notFound();

  return <ChapterView course={found.course} chapter={found.chapter} />;
}
