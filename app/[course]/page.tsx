import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { courses, getCourse } from "@/content";
import { CourseView } from "@/components/course/course-view";

export function generateStaticParams() {
  return courses.map((course) => ({ course: course.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[course]">): Promise<Metadata> {
  const { course: courseSlug } = await params;
  const course = getCourse(courseSlug);
  if (!course) return {};

  const title = `${course.title} | Learn`;
  return {
    title,
    description: course.description,
    alternates: {
      canonical: `/${course.slug}`,
    },
    openGraph: {
      title,
      description: course.description,
      url: `/${course.slug}`,
      siteName: "Learn",
      type: "website",
    },
  };
}

export default async function CoursePage(props: PageProps<"/[course]">) {
  const { course: courseSlug } = await props.params;
  const course = getCourse(courseSlug);
  if (!course) notFound();

  return <CourseView course={course} />;
}
