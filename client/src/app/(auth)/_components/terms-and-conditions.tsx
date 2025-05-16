export default function TermsAndConditions() {
  return (
    <div className='text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  '>
      By clicking continue, you agree to our{' '}
      <a href='/terms'>Terms of Service</a> and{' '}
      <a href='/privacy'>Privacy Policy</a>.
    </div>
  );
}
