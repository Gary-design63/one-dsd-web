-- Resources can carry read-aloud audio in the consultant's own voice.
begin;
alter table pac.resource_media drop constraint if exists resource_media_kind_check;
alter table pac.resource_media add constraint resource_media_kind_check check (kind in ('audio', 'image', 'video', 'document'));
commit;
