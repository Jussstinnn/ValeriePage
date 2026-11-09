param([Parameter(Mandatory=$true)][string]$Plan)
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.IO.Compression
$job = Get-Content -LiteralPath $Plan -Raw -Encoding UTF8 | ConvertFrom-Json
$stream = $null
$zip = $null
try {
  $archiveName = '\\?\' + [System.IO.Path]::GetFullPath($job.archive)
  $stream = [System.IO.File]::Open($archiveName, [System.IO.FileMode]::CreateNew)
  $zip = [System.IO.Compression.ZipArchive]::new($stream, [System.IO.Compression.ZipArchiveMode]::Create, $false)
  foreach ($item in $job.files) {
    $resolved = [System.IO.Path]::GetFullPath($item.source)
    if (-not $resolved.StartsWith($job.root + '\', [System.StringComparison]::OrdinalIgnoreCase)) { throw 'Source outside package root' }
    # Extended-length input and direct ZIP entries avoid the old staging/MAX_PATH failure.
    $sourceName = '\\?\' + $resolved
    $source = $null
    $target = $null
    try {
      $source = [System.IO.File]::OpenRead($sourceName)
      if ($source.Length -ne $item.bytes) { throw ('Source changed: ' + $item.entry) }
      $entry = $zip.CreateEntry($item.entry, [System.IO.Compression.CompressionLevel]::Optimal)
      $target = $entry.Open()
      $source.CopyTo($target)
    } finally {
      if ($null -ne $target) { $target.Dispose() }
      if ($null -ne $source) { $source.Dispose() }
    }
  }
} finally {
  if ($null -ne $zip) { $zip.Dispose() }
  if ($null -ne $stream) { $stream.Dispose() }
}
Write-Output ('Packaged ' + $job.files.Count + ' files')
